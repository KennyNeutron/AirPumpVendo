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