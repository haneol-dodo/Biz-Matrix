import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ActionType = 'page_visit' | 'search_execution' | 'result_view' | 'pdf_export' | 'txt_export' | 'input_focus' | 'input_clear';

const getSessionId = (): string => {
  const sessionKey = 'biz_matrix_session_id';
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(sessionKey, sessionId);
  }
  return sessionId;
};

export const trackAction = async (
  actionType: ActionType,
  fieldValue?: string
): Promise<void> => {
  try {
    const sessionId = getSessionId();
    await supabase.from('action_logs').insert({
      session_id: sessionId,
      action_type: actionType,
      field_value: fieldValue || null,
    });
  } catch (error) {
    console.error('Failed to track action:', error);
  }
};
