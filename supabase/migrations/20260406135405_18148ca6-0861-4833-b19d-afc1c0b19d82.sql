
-- Trainers table
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  hourly_rate NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainers are viewable by everyone" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Admins can manage trainers" ON public.trainers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gym classes table
CREATE TABLE public.gym_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_slots INTEGER NOT NULL DEFAULT 20,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gym_classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Classes are viewable by everyone" ON public.gym_classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON public.gym_classes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_gym_classes_updated_at BEFORE UPDATE ON public.gym_classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Class bookings
CREATE TABLE public.class_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.gym_classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'completed')),
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings" ON public.class_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can book classes" ON public.class_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel their own bookings" ON public.class_bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.class_bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Trainers can view bookings for their classes" ON public.class_bookings FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.gym_classes gc
    JOIN public.trainers t ON gc.trainer_id = t.id
    WHERE gc.id = class_bookings.class_id AND t.user_id = auth.uid()
  )
);

-- Membership plans
CREATE TABLE public.membership_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_months INTEGER NOT NULL DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by everyone" ON public.membership_plans FOR SELECT USING (true);
CREATE POLICY "Admins can manage plans" ON public.membership_plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_membership_plans_updated_at BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User memberships
CREATE TABLE public.user_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.membership_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own memberships" ON public.user_memberships FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all memberships" ON public.user_memberships FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_user_memberships_updated_at BEFORE UPDATE ON public.user_memberships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_bookings;

-- Seed membership plans
INSERT INTO public.membership_plans (name, price, duration_months, features, is_popular) VALUES
('Starter', 15000, 1, ARRAY['Access to gym floor', 'Locker room access', '2 group classes/week', 'Basic fitness assessment'], false),
('Pro', 30000, 1, ARRAY['Everything in Starter', 'Unlimited group classes', '1 personal training/month', 'Nutrition consultation', 'Sauna & steam room'], true),
('Elite', 50000, 1, ARRAY['Everything in Pro', 'Unlimited personal training', 'Priority class booking', 'Guest passes (2/month)', 'Premium locker', 'Recovery zone access'], false);

-- Seed sample trainers
INSERT INTO public.trainers (full_name, bio, specialties, certifications, hourly_rate, rating, total_reviews, image_url) VALUES
('Adebayo Okonkwo', 'Former professional athlete with 10+ years of coaching experience. Specializes in strength and conditioning.', ARRAY['Strength Training', 'HIIT', 'Sports Performance'], ARRAY['NASM-CPT', 'CSCS', 'First Aid'], 8000, 4.9, 127, ''),
('Chioma Nwosu', 'Certified yoga instructor and wellness coach. Passionate about mind-body connection and holistic fitness.', ARRAY['Yoga', 'Pilates', 'Meditation'], ARRAY['RYT-500', 'ACE-CPT', 'Nutrition Coach'], 7000, 4.8, 98, ''),
('Emeka Ibe', 'Boxing champion turned fitness coach. Known for high-energy classes and transformative results.', ARRAY['Boxing', 'CrossFit', 'Cardio'], ARRAY['USA Boxing Coach', 'CrossFit L2', 'NASM-PES'], 9000, 4.7, 85, '');

-- Seed sample classes
INSERT INTO public.gym_classes (name, description, category, trainer_id, day_of_week, start_time, end_time, max_slots) VALUES
('Power HIIT', 'High-intensity interval training to torch calories and build endurance.', 'HIIT', (SELECT id FROM public.trainers WHERE full_name = 'Adebayo Okonkwo'), 1, '06:00', '07:00', 25),
('Vinyasa Flow', 'Dynamic yoga class connecting breath with movement for flexibility and strength.', 'Yoga', (SELECT id FROM public.trainers WHERE full_name = 'Chioma Nwosu'), 2, '07:00', '08:00', 20),
('Boxing Fundamentals', 'Learn proper boxing technique while getting an incredible full-body workout.', 'Boxing', (SELECT id FROM public.trainers WHERE full_name = 'Emeka Ibe'), 3, '18:00', '19:00', 15),
('Strength & Power', 'Build lean muscle with compound lifts and progressive overload training.', 'Strength', (SELECT id FROM public.trainers WHERE full_name = 'Adebayo Okonkwo'), 4, '17:00', '18:00', 20),
('Sunrise Yoga', 'Start your day with energizing yoga poses and mindful breathing.', 'Yoga', (SELECT id FROM public.trainers WHERE full_name = 'Chioma Nwosu'), 5, '06:00', '07:00', 20),
('CrossFit WOD', 'Workout of the Day combining weightlifting, gymnastics, and cardio.', 'CrossFit', (SELECT id FROM public.trainers WHERE full_name = 'Emeka Ibe'), 6, '09:00', '10:00', 18);
