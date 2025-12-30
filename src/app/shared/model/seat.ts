

export interface SeatOut {
  seat_id?: number;
  screen_id: number;
  row_number: number;
  col_number: number;
  category_id: number;
  seat_number?: string;
  is_available: boolean;
  category_name?: string;
  price?: number;
}

