
CREATE TABLE public.gym_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gym_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checkins"
ON public.gym_checkins FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can check themselves in"
ON public.gym_checkins FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all checkins"
ON public.gym_checkins FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert checkins"
ON public.gym_checkins FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_gym_checkins_user_id ON public.gym_checkins(user_id);
CREATE INDEX idx_gym_checkins_checked_in_at ON public.gym_checkins(checked_in_at DESC);
