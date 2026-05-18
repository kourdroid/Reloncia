export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string
          tenant_id: string
          client_id: string
          invoice_number: string
          amount_ttc: number
          due_date: string
          status: string
          law_69_21_flag: boolean
          legal_threshold_date: string | null
          clients?: { name: string }
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          tenant_id: string
        }
      }
      tenants: {
        Row: {
          id: string
          cabinet_id: string
          name: string
        }
      }
      users: {
        Row: {
          id: string
          role: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          entity: string
          entityId: string
          userId: string
          metadata: Json
        }
      }
      reminders: {
        Row: {
          id: string
          tenant_id: string
          invoice_id: string
          status: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      create_audit_log: {
        Args: {
          p_tenant_id: string
          p_actor_profile_id: string
          p_action: string
          p_target_table: string
          p_target_id: string
          p_before_json?: Json
          p_after_json?: Json
          p_metadata_json?: Json
        }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
