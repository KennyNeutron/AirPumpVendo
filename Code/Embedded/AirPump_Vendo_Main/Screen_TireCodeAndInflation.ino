bool Screen_TireCodeAndInflation_INIT = false;
static lv_obj_t* TA_TireCode = nullptr;
static lv_obj_t* KB_Input = nullptr;

// Text Area focus handler: show keyboard on focus
static void ta_focus_event_cb(lv_event_t* e) {
  lv_event_code_t code = lv_event_get_code(e);
  if (code == LV_EVENT_FOCUSED) {
    if (KB_Input) {
      lv_keyboard_set_textarea(KB_Input, TA_TireCode);
      lv_obj_remove_flag(KB_Input, LV_OBJ_FLAG_HIDDEN);
    }
  }
}

// Keyboard handler: hide keyboard on OK/CANCEL
static void kb_event_cb(lv_event_t* e) {
  lv_event_code_t code = lv_event_get_code(e);
  if (code == LV_EVENT_READY || code == LV_EVENT_CANCEL) {
    // Hide keyboard
    lv_obj_add_flag(KB_Input, LV_OBJ_FLAG_HIDDEN);
    // Optionally defocus the textarea so it won’t reopen immediately if tapped space around
    if (TA_TireCode) lv_obj_clear_state(TA_TireCode, LV_STATE_FOCUSED);
  }
}

// Builder: create Text Area + Keyboard on this screen
static void TI_Add_TextInput(lv_obj_t* parent) {
  // --- Text Area ---
  TA_TireCode = lv_textarea_create(parent);
  lv_obj_set_size(TA_TireCode, 220, 48);
  lv_obj_align(TA_TireCode, LV_ALIGN_TOP_MID, 0, 50);  // adjust to your layout
  lv_textarea_set_placeholder_text(TA_TireCode, "Enter Tire Code…");
  lv_obj_set_style_text_font(TA_TireCode, &lv_font_montserrat_18, 0);
  lv_obj_add_event_cb(TA_TireCode, ta_focus_event_cb, LV_EVENT_FOCUSED, NULL);
  // Optional: single-line input (set to true if you prefer one line)
  lv_textarea_set_one_line(TA_TireCode, true);

  // --- Keyboard ---
  KB_Input = lv_keyboard_create(parent);
  lv_obj_set_size(KB_Input, LV_PCT(100), 140);  // full width, fixed height
  lv_obj_align(KB_Input, LV_ALIGN_BOTTOM_MID, 0, 0);
  lv_keyboard_set_textarea(KB_Input, TA_TireCode);
  lv_keyboard_set_mode(KB_Input, LV_KEYBOARD_MODE_TEXT_LOWER);  // default mode
  lv_obj_add_event_cb(KB_Input, kb_event_cb, LV_EVENT_ALL, NULL);

  // Start hidden; it shows when the TA is focused
  lv_obj_add_flag(KB_Input, LV_OBJ_FLAG_HIDDEN);
}


void Screen_TireCodeAndInflation_PRE() {
  SCR_TireCodeAndInflation = lv_obj_create(NULL);
  lv_scr_load(SCR_TireCodeAndInflation);

  lv_obj_set_style_bg_color(SCR_TireCodeAndInflation, lv_color_hex(0x000000), 0);
  lv_obj_set_style_bg_opa(SCR_TireCodeAndInflation, LV_OPA_COVER, 0);

  SCR_CurrentScreen = SCR_TireCodeAndInflation;
  CurrentScreenID = 0x1100;

  lv_obj_t* Screen_Title = create_label(SCR_TireCodeAndInflation, "TIRE CODE & INFLATION", &lv_font_montserrat_18, lv_color_white());
  lv_obj_align(Screen_Title, LV_ALIGN_TOP_MID, 0, 0);

  TI_Add_TextInput(SCR_TireCodeAndInflation);
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