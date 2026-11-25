import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bxrmvoputafafhjmstun.supabase.co";
const supabaseKey = "sb_publishable_VBV6HinpjwMqoOXI9gIqzQ_78LZzA5E";

export const supabase = createClient(supabaseUrl, supabaseKey);
