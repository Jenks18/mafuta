import { createClient } from '@supabase/supabase-js';

// In production, load these from environment variables
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;

let client = null;
try {
	if (SUPABASE_URL && SUPABASE_ANON_KEY) {
		client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
	}
} catch (e) {
	// Silently fall back to null; the app should continue to work offline/mock
	client = null;
}

export const supabase = client;
