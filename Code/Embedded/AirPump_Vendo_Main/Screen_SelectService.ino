bool Screen_SelectService_INIT = false;

void Screen_SelectService_PRE() {
  // To be implemented
  SCR_SelectService = lv_obj_create(NULL);
  lv_scr_load(SCR_SelectService);

  lv_obj_set_style_bg_color(SCR_SelectService, lv_color_hex(0x000000), 0);
  lv_obj_set_style_bg_opa(SCR_SelectService, LV_OPA_COVER, 0);

  SCR_CurrentScreen = SCR_SelectService;
  CurrentScreenID = 0x1000;

  lv_obj_t* Screen_Title = create_label(SCR_SelectService, "SELECT SERVICE", &lv_font_montserrat_22, lv_color_white());
  lv_obj_align(Screen_Title, LV_ALIGN_TOP_MID, 0, 0);

  // Tire Code and Inflation Section
  lv_obj_t* Icon_TireCodeAndInflation = create_label(SCR_SelectService, LV_SYMBOL_SETTINGS, &lv_font_montserrat_48, lv_color_hex(0x0099FF));
  lv_obj_align(Icon_TireCodeAndInflation, LV_ALIGN_TOP_LEFT, 10, 50);
  lv_obj_t* Label_TireCodeAndInflation_Title = create_label(SCR_SelectService, "TIRE CODE & INFLATION", &lv_font_montserrat_18, lv_color_white());
  lv_obj_align(Label_TireCodeAndInflation_Title, LV_ALIGN_TOP_LEFT, 70, 50);

  lv_obj_t* Label_TireCodeAndInflation_Description = create_label(SCR_SelectService, "Get recommended PSI for your tire code\nand optional inflation service", &lv_font_montserrat_12, lv_color_white());
  lv_obj_align(Label_TireCodeAndInflation_Description, LV_ALIGN_TOP_LEFT, 70, 75);

  //Tire Code and Inflation Go Button
  lv_obj_t* GoButton_TireCodeAndInflation = lv_button_create(SCR_MainMenu);
  lv_obj_set_size(GoButton_TireCodeAndInflation, 60, 30);
  lv_obj_align(GoButton_TireCodeAndInflation, LV_ALIGN_TOP_RIGHT, -10, 95);

  // Style the Go Button
  lv_obj_set_style_bg_color(GoButton_TireCodeAndInflation, lv_color_hex(0x33CC33), 0);
  lv_obj_set_style_bg_color(GoButton_TireCodeAndInflation, lv_color_hex(0x0099FF), LV_STATE_PRESSED);
  lv_obj_set_style_radius(GoButton_TireCodeAndInflation, 5, 0);
  lv_obj_set_style_border_width(GoButton_TireCodeAndInflation, 1, 0);
  lv_obj_set_style_border_color(GoButton_TireCodeAndInflation, lv_color_white(), 0);

  lv_obj_t* Label_GoButton_TireCodeAndInflation = lv_label_create(GoButton_TireCodeAndInflation);
  lv_label_set_text(Label_GoButton_TireCodeAndInflation, "GO");
  lv_obj_center(Label_GoButton_TireCodeAndInflation);
  lv_obj_set_style_text_color(Label_GoButton_TireCodeAndInflation, lv_color_black(), 0);
  lv_obj_set_style_text_font(Label_GoButton_TireCodeAndInflation, &lv_font_montserrat_16, 0);


  //DOT Code Safety Check Section
  lv_obj_t* Icon_DOTCodeSafetyCheck = create_label(SCR_SelectService, LV_SYMBOL_OK, &lv_font_montserrat_48, lv_color_hex(0x00FF00));
  lv_obj_align(Icon_DOTCodeSafetyCheck, LV_ALIGN_TOP_LEFT, 10, 150);
  lv_obj_t* Label_DOTCodeSafetyCheck_Title = create_label(SCR_SelectService, "DOT CODE SAFETY CHECK", &lv_font_montserrat_18, lv_color_white());
  lv_obj_align(Label_DOTCodeSafetyCheck_Title, LV_ALIGN_TOP_LEFT, 70, 150);

  lv_obj_t* Label_DOTCodeSafetyCheck_Description = create_label(SCR_SelectService, "Check your tire's manufacturing date\nand safety status", &lv_font_montserrat_12, lv_color_white());
  lv_obj_align(Label_DOTCodeSafetyCheck_Description, LV_ALIGN_TOP_LEFT, 70, 175);

  //DOT Code Safety Check Go Button
    lv_obj_t* GoButton_DOTCodeSafetyCheck = lv_button_create(SCR_MainMenu);
  lv_obj_set_size(GoButton_DOTCodeSafetyCheck, 60, 30);
  lv_obj_align(GoButton_DOTCodeSafetyCheck, LV_ALIGN_TOP_RIGHT, -10, 195);

  // Style the Go Button
  lv_obj_set_style_bg_color(GoButton_DOTCodeSafetyCheck, lv_color_hex(0x33CC33), 0);
  lv_obj_set_style_bg_color(GoButton_DOTCodeSafetyCheck, lv_color_hex(0x0099FF), LV_STATE_PRESSED);
  lv_obj_set_style_radius(GoButton_DOTCodeSafetyCheck, 5, 0);
  lv_obj_set_style_border_width(GoButton_DOTCodeSafetyCheck, 1, 0);
  lv_obj_set_style_border_color(GoButton_DOTCodeSafetyCheck, lv_color_white(), 0);

  lv_obj_t* Label_GoButton_DOTCodeSafetyCheck = lv_label_create(GoButton_DOTCodeSafetyCheck);
  lv_label_set_text(Label_GoButton_DOTCodeSafetyCheck, "ENTER");
  lv_obj_center(Label_GoButton_DOTCodeSafetyCheck);
  lv_obj_set_style_text_color(Label_GoButton_DOTCodeSafetyCheck, lv_color_black(), 0);
  lv_obj_set_style_text_font(Label_GoButton_DOTCodeSafetyCheck, &lv_font_montserrat_16, 0);

}

void Screen_SelectService() {
  if (!Screen_SelectService_INIT) {
    Screen_SelectService_INIT = true;
    Screen_SelectService_PRE();
  }
}

void Screen_SelectService_POST() {
  Screen_SelectService_INIT = false;
}