bool Screen_TireCodeAndInflation_INIT = false;

void Screen_TireCodeAndInflation_PRE() {
  SCR_TireCodeAndInflation = lv_obj_create(NULL);
  lv_scr_load(SCR_TireCodeAndInflation);

  lv_obj_set_style_bg_color(SCR_TireCodeAndInflation, lv_color_hex(0x000000), 0);
  lv_obj_set_style_bg_opa(SCR_TireCodeAndInflation, LV_OPA_COVER, 0);

  SCR_CurrentScreen = SCR_TireCodeAndInflation;
  CurrentScreenID = 0x1100;

  lv_obj_t* Screen_Title = create_label(SCR_TireCodeAndInflation, "TIRE CODE & INFLATION", &lv_font_montserrat_18, lv_color_white());
  lv_obj_align(Screen_Title, LV_ALIGN_TOP_MID, 0, 0);
}

void Screen_TireCodeAndInflation() {
  if (!Screen_TireCodeAndInflation_INIT) {
    Screen_TireCodeAndInflation_INIT = true;
    Screen_TireCodeAndInflation_PRE();
  }
}

void Screen_TireCodeAndInflation_POST() {
  Screen_TireCodeAndInflation_INIT = false;
} 