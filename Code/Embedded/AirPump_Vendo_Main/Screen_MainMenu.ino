bool Screen_MainMenu_INIT = false;

static void EnterButton_Clicked(lv_event_t* e){
  lv_obj_del(SCR_CurrentScreen); // Delete the current screen
  Screen_SelectService_POST();
  Screen_SelectService();
}

void Screen_MainMenu_PRE() {
  SCR_MainMenu = lv_obj_create(NULL);
  lv_scr_load(SCR_MainMenu);

  lv_obj_set_style_bg_color(SCR_MainMenu, lv_color_hex(0x000000), 0);
  lv_obj_set_style_bg_opa(SCR_MainMenu, LV_OPA_COVER, 0);

  SCR_CurrentScreen = SCR_MainMenu;
  CurrentScreenID = 0x0000;

  // lv_obj_t* text_label = lv_label_create(lv_screen_active());
  // lv_label_set_text(text_label, "TIRE SERVICE KIOSK");
  // lv_obj_set_style_text_align(text_label, LV_TEXT_ALIGN_CENTER, 0);
  // lv_obj_align(text_label, LV_ALIGN_TOP_MID, 0, 30);
  LV_FONT_DECLARE(font_Font90Icon_48_1bpp);

  lv_obj_t* Screen_Title = create_label(SCR_MainMenu, "TIRE SERVICE KIOSK", &lv_font_montserrat_22, lv_color_white());
  lv_obj_align(Screen_Title, LV_ALIGN_TOP_MID, 0, 60);

  lv_obj_t* Screen_Description = create_label(SCR_MainMenu, "Your complete tire safety and maintenance solution", &lv_font_montserrat_12, lv_color_white());
  lv_obj_align(Screen_Description, LV_ALIGN_TOP_MID, 0, 90);

  lv_obj_t* icon_TireCode_Label = create_label(SCR_MainMenu, "w", &font_Font90Icon_48_1bpp, lv_color_hex(0x0099FF));
  lv_obj_align(icon_TireCode_Label, LV_ALIGN_TOP_MID, -70, 0);

  lv_obj_t* icon_DOTCheck_Label = create_label(SCR_MainMenu, "N", &font_Font90Icon_48_1bpp, lv_color_hex(0x00FF00));
  lv_obj_align(icon_DOTCheck_Label, LV_ALIGN_TOP_MID, 0, 0);

  lv_obj_t* icon_TireInflation_Label = create_label(SCR_MainMenu, "R", &font_Font90Icon_48_1bpp, lv_color_hex(0xFF9900));
  lv_obj_align(icon_TireInflation_Label, LV_ALIGN_TOP_MID, 70, 0);


  lv_obj_t* enter_button = lv_button_create(SCR_MainMenu);
  lv_obj_set_size(enter_button, 60, 30);
  lv_obj_align(enter_button, LV_ALIGN_BOTTOM_MID, 0, -30);

  // Style the enter button
  lv_obj_set_style_bg_color(enter_button, lv_color_hex(0x00FF00), 0);                 // Green background
  lv_obj_set_style_bg_color(enter_button, lv_color_hex(0x009900), LV_STATE_PRESSED);  // Darker green when pressed
  lv_obj_set_style_radius(enter_button, 5, 0);
  lv_obj_set_style_border_width(enter_button, 1, 0);
  lv_obj_set_style_border_color(enter_button, lv_color_white(), 0);


  // enter button label
  lv_obj_t* enter_label = lv_label_create(enter_button);
  lv_label_set_text(enter_label, "ENTER");
  lv_obj_center(enter_label);
  lv_obj_set_style_text_color(enter_label, lv_color_black(), 0);
  lv_obj_set_style_text_font(enter_label, &lv_font_montserrat_16, 0);
}
void Screen_MainMenu() {
  if (!Screen_MainMenu_INIT) {
    Screen_MainMenu_INIT = true;
    Screen_MainMenu_PRE();
  }
}

void Screen_MainMenu_POST() {
  Screen_MainMenu_INIT = false;
}