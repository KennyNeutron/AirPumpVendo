bool Screen_MainMenu_INIT = false;

void Screen_MainMenu_PRE() {
  SCR_MainMenu = lv_obj_create(NULL);
  lv_scr_load(SCR_MainMenu);


  lv_obj_t* text_label = lv_label_create(lv_screen_active());
  lv_label_set_long_mode(text_label, LV_LABEL_LONG_WRAP);  // Breaks the long lines
  lv_label_set_text(text_label, "Hello World! This is AIRpump Vendo LVGL");
  lv_obj_set_width(text_label, 340);  // Set smaller width to make the lines wrap
  lv_obj_set_style_text_align(text_label, LV_TEXT_ALIGN_CENTER, 0);
  lv_obj_align(text_label, LV_ALIGN_CENTER, 0, -100);
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