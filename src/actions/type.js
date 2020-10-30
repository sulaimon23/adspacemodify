import {editProfile} from "./ProfileActions";

export const HOME_FETCH = 'home_fetch';
export const HOME_FETCH_SUCCESS = 'home_fetch_success';
export const HOME_FETCH_FAILED = 'home_fetch_failed';
export const HOME_STATE_CHANGE = 'home_state_change';
export const HOME_CITY_CHANGE = 'home_city_change';
export const HOME_CATEGORY_CHANGE = 'home_category_change';
export const HOME_RESET_SEARCH = 'home_reset_search';
export const HOME_TAGS_CHANGE = 'home_tags_change';
export const HOME_STARTDATE_CHANGE = 'home_startdate_change';
export const HOME_STATE = 'home_state';
export const HOME_COUNTRY_CHANGE = 'change';


export const LOCATIONS_FILTER_BY_SUBCATEGORY = 'locations_filter_by_subcategory';


export const LOCATIONS_FETCH = 'locations_fetch';
export const LOCATIONS_FETCH_FAILED = 'locations_fetch_failed';
export const LOCATIONS_FETCH_SUCCESS = 'locations_fetch_success';
export const LOCATIONS_SHOW_BOOKING_DETAILS = 'locations_show_booking_details';
export const LOCATIONS_SUBCATS_FETCH = 'locations_subcats_fetch';
export const LOCATIONS_SUBCATS_FETCH_FAILED = 'locations_subcats_fetch_failed';
export const LOCATIONS_SUBCATS_FETCH_SUCCESS = 'locations_subcats_fetch_success';
export const LOCATIONS_SORT = 'locations_sort';

export const BLOGS_FETCH = 'blogs_fetch';
export const BLOGS_FETCH_SUCCESS = 'blogs_fetch_success';
export const BLOGS_FETCH_FAILED = 'blogs_fetch_failed';

export const BLOG_FETCH = 'blog_fetch';
export const BLOG_FETCH_FAILED = 'blog_fetch_failed';
export const BLOG_FETCH_SUCCESS = 'blog_fetch_success';
export const BLOG_SET_BLOG = 'blog_set_blog';

export const LOGIN_SAVE = 'login_save';
export const LOGIN_SAVE_SUCCESS = 'login_save_success';
export const LOGIN_SAVE_FAILED = 'login_save_failed';
export const LOGIN_DISPLAY_MESSAGE = 'login_display_message';
export const LOGIN_SET_AUTHENTICATED = 'login_set_authenticated';
export const LOGOUT = 'logout';
export const LOGOUT_SUCCESS = 'logout_success';
export const LOGIN_FORGOT_PASSWORD_SHOW = 'login_forgot_password_show';
export const LOGIN_FORGOT_PASSWORD_SAVE_FAILED = 'login_forgot_password_save_failed';
export const LOGIN_FORGOT_PASSWORD_SAVE_SUCCESS = 'login_forgot_password_save_success';
export const LOGIN_FORGOT_PASSWORD_SAVE = 'login_forgot_password_save';


export const SIGNUP_SAVE = 'signup_save';
export const SIGNUP_SAVE_SUCCESS = 'signup_save_success';
export const SIGNUP_SAVE_FAILED = 'signup_save_failed';
export const SIGNUP_DISPLAY_MESSAGE = 'signup_display_message';

export const LOCATION_SET = 'location_set';
export const LOCATION_FETCH = 'location_fetch';
export const LOCATION_FETCH_SUCCESS = 'location_fetch_success';
export const LOCATION_FETCH_FAILED = 'location_fetch_failed';
export const LOCATION_SIMILAR_FETCH = 'location_similar_fetch';
export const LOCATION_SIMILAR_FETCH_FAILED = 'location_similar_fetch_failed';
export const LOCATION_SIMILAR_FETCH_SUCCESS = 'location_similar_fetch_SUCCESS';
export const LOCATION_PRICING_OPTIONS = 'location_pricing_options';
export const LOCATION_VOUCHERS = 'location_vouchers';
export const LOCATIONS_GET_MORE = 'locations_get_more';


export const BOOKING_DISPLAY_ERROR = 'booking_display_error';
export const BOOKING_SAVE = 'booking_save';
export const BOOKING_SAVE_SUCCESS = 'booking_save_success';
export const BOOKING_SAVE_FAILED = 'booking_save_failed';
export const BOOKING_RESET = 'booking_reset';

export const CONTACTUS_SAVE = 'contactus_save';
export const CONTACTUS_SAVE_SUCCESS = 'contactus_save_success';
export const CONTACTUS_SAVE_FAILED = 'contactus_save_failed';


export const PROFILE_SHOW_EDIT = 'profile_show_edit';
export const PROFILE_NAME_CHANGE = 'profile_name_change';
export const PROFILE_SUBSCRIBE_CHANGE = 'profile_subscribe_change';
export const PROFILE_FETCH = 'profile_fetch';
export const PROFILE_FETCH_FAILED = 'profile_fetch_failed';
export const PROFILE_FETCH_SUCCESS = 'profile_fetch_success';
export const PROFILE_DISPLAY_MESSAGE = 'profile_display_message';
export const PROFILE_SAVE = 'profile_save';
export const PROFILE_SAVE_SUCCESS = 'profile_save_success';
export const PROFILE_SAVE_FAILED = 'profile_save_failed';
export const PROFILE_FETCH_ORDERS = 'profile_fetch_orders';
export const PROFILE_FETCH_ORDERS_FAILED = 'profile_fetch_orders_failed';
export const PROFILE_FETCH_ORDERS_SUCCESS = 'profile_fetch_orders_success';
export const PROFILE_CHANGE_BRAND = 'profile_change_brand';
export const PROFILE_UPDATE_LOCATIONS_USER = 'profile_update_locations_user';
export const PROFILE_UPDATE_MEDIAPLANNING_USER = 'profile_update_mediaplanning_user';
export const PROFILE_DELETE_ACCOUNT = 'profile_delete_account';
export const PROFILE_DELETE_ACCOUNT_FAILED = 'profile_delete_account_failed';
export const PROFILE_DELETE_ACCOUNT_SUCCESS = 'profile_delete_account_success';

export const MEDIA_PLANNING_FETCH = 'media_planning_fetch';
export const MEDIA_PLANNING_FETCH_SUCCESS = 'media_planning_fetch_success';
export const MEDIA_PLANNING_FETCH_FAILED = 'media_planning_fetch_failed';
export const MEDIA_PLANNING_REFINING = 'media_planning_refining';
export const MEDIA_PLANNING_REFINING_SUCCESS = 'media_planning_refining_success';
export const MEDIA_PLANNING_REFINING_FAILED = 'media_planning_refining_failed';
export const MEDIA_PLANNING_ADD_REDUCE = 'media_planning_add_reduce';
export const MEDIA_PLANNING_MESSAGE = 'media_planning_message';
export const MEDIA_PLANNING_SHOW_BOOKING = 'media_planning_show_booking';
export const MEDIA_PLANNING_PERIOD_CHANGE = 'media_planning_period_change';
export const MEDIA_PLANNING_NOT_APPLICABLE_CHANGE = 'media_planning_not_applicable_change';
export const MEDIA_PLANNING_SAVE = 'media_planning_save';
export const MEDIA_PLANNING_SAVE_FAILED = 'media_planning_save_failed';
export const MEDIA_PLANNING_SAVE_SUCCESS = 'media_planning_save_success';
export const MEDIA_PLANNING_PAGINATED = 'media_planning_paginated';
export const MEDIA_PLANNING_SORT = 'media_planning_sort';
export const MEDIA_PLANNING_DATE = 'media_planning_date';
export const MEDIA_PLANNING_OPENROW = 'media_planning_openrow';
export const MEDIA_PLANNING_FILEUPLOAD = 'media_planning_fileupload';
export const MEDIA_PLANNING_LOAD_SAVED_PLAN = 'media_planning_load_saved_plan';
export const MEDIA_PLANNING_LOAD_SAVED_PLAN_SUCCESS = 'media_planning_load_saved_plan_success';
export const MEDIA_PLANNING_LOAD_SAVED_PLAN_FAILED = 'media_planning_load_saved_plan_failed';
export const MEDIA_PLANNING_SAVE_PLAN = 'media_planning_save_plan';
export const MEDIA_PLANNING_SELECT_PLANS = 'media_planning_select_plans';
export const MEDIA_PLANNING_REMOVED_BRAND = 'media_planning_removed_brand';
export const MEDIA_PLANNING_SHOW_SIGN_IN = 'media_planning_show_sign_in';
export const MEDIA_PLANNING_SHOW_CURRENT_STATE = 'media_planning_show_current_state';
export const MEDIA_PLANNING_AFTER_SIGNUP = 'media_planning_after_signup';
export const MEDIA_PLANNING_AFTER_SIGNUP_SUCCESS = 'media_planning_after_signup_success';
export const MEDIA_PLANNING_AFTER_SIGNUP_FAILED = 'media_planning_after_signup_failed';
export const MEDIA_PLANNING_DO_NOTHING = 'media_planning_do_nothing';

export const BRANDING_FETCH = 'branding_fetch';
export const BRANDING_FETCH_SUCCESS = 'branding_fetch_success';
export const BRANDING_FETCH_FAILED = 'branding_fetch_failed';
export const BRANDING_SAVE = 'branding_save';
export const BRANDING_SAVE_SUCCESS = 'branding_save_success';
export const BRANDING_SAVE_FAILED = 'branding_save_failed';
export const BRANDING_SAVE_BEFORE_SIGNUP = 'branding_save_before_signup';
export const BRANDING_RESET_BRANDING = 'branding_reset_branding';

export const CURRENCY = 'currency';
export const CURRENCY_FAILED = 'currency_failed';