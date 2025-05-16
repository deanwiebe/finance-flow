<?php

// Enqueue the React app's JS and CSS assets
function finance_flow_enqueue_scripts() {
    wp_enqueue_script(
        'finance-flow-react',
        get_template_directory_uri() . '/dist/assets/index.js',
        array(),
        null,
        true
    );

    wp_enqueue_style(
        'finance-flow-style',
        get_template_directory_uri() . '/dist/assets/index.css',
        array(),
        null
    );

    //Nonce Value
    wp_localize_script('finance-flow-react', 'financeFlowData', array(
        'nonce' => wp_create_nonce('wp_rest'),
        'user' => wp_get_current_user(),
        'isLoggedIn' => is_user_logged_in() ? '1' : '0',
        'username'   => is_user_logged_in() ? wp_get_current_user()->user_login : '',
    ));

}
add_action('wp_enqueue_scripts', 'finance_flow_enqueue_scripts');

// Redirect non-admins away from any wp-admin page (except AJAX)
function restrict_wp_admin_access() {
    if (is_admin() && !current_user_can('administrator') && !(defined('DOING_AJAX') && DOING_AJAX)) {
        wp_redirect(home_url()); // Or your React app root
        exit;
    }
}
add_action('admin_init', 'restrict_wp_admin_access');

// Hide the admin bar for non-admin users
function hide_admin_bar_for_non_admins() {
    if (!current_user_can('administrator')) {
        show_admin_bar(false);
    }
}
add_action('after_setup_theme', 'hide_admin_bar_for_non_admins');


//Redirect after Logout 
add_action('wp_logout', function() {
    wp_redirect(home_url('/')); // or '/login' if you want
    exit();
});