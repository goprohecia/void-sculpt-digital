
-- 1. Create subscription_plan enum
CREATE TYPE public.subscription_plan AS ENUM ('starter', 'business', 'enterprise');

-- 2. Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan subscription_plan NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  modules_limit INTEGER,
  custom_modules JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create custom_spaces table
CREATE TABLE public.custom_spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  base_role TEXT NOT NULL DEFAULT 'employee',
  enabled_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_spaces ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies for subscriptions
CREATE POLICY "Admins full access own subscription" ON public.subscriptions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 6. RLS policies for custom_spaces
CREATE POLICY "Admins full access own custom_spaces" ON public.custom_spaces
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can view custom_spaces" ON public.custom_spaces
  FOR SELECT TO authenticated
  USING (true);

-- 7. Updated_at trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
