export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          language: string;
          display_currency: string;
          plan: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          language?: string;
          display_currency?: string;
          plan?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          language?: string;
          display_currency?: string;
          plan?: string;
          created_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          value: number;
          currency: string;
          note: string | null;
          is_auto_synced: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          value: number;
          currency: string;
          note?: string | null;
          is_auto_synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          value?: number;
          currency?: string;
          note?: string | null;
          is_auto_synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      net_worth_history: {
        Row: {
          id: string;
          user_id: string;
          total_cny: number;
          snapshot_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_cny: number;
          snapshot_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_cny?: number;
          snapshot_date?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type AssetRow = Database["public"]["Tables"]["assets"]["Row"];
export type NetWorthHistoryRow =
  Database["public"]["Tables"]["net_worth_history"]["Row"];
