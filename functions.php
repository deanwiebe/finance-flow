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
        'apiUrl' => rest_url('finance-flow/v1'),  // <--- Add this line
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



//this was put in to avoid the 404 error when trying to access the React app from page refresh
function finance_flow_redirect_react_routes_to_dashboard() {
    $react_routes = [
        'upload',
        'reports',
        'dashboard',
        'terms-of-use',
        'privacy-policy',
        // add more React routes here
    ];

    $request_path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

    foreach ($react_routes as $route) {
        if ($request_path === $route || strpos($request_path, $route . '/') === 0) {
            // Load the Dashboard page by ID
            global $wp_query;

            // Get the page ID for your Dashboard page here
            $dashboard_page_id = 11; // <--- change this to your real page ID

            // Setup the query for that page
            $wp_query->query = [];
            $wp_query->queried_object = get_post($dashboard_page_id);
            $wp_query->queried_object_id = $dashboard_page_id;
            $wp_query->post = get_post($dashboard_page_id);
            $wp_query->posts = [$wp_query->post];
            $wp_query->found_posts = 1;
            $wp_query->post_count = 1;
            $wp_query->is_page = true;
            $wp_query->is_singular = true;
            $wp_query->is_home = false;
            $wp_query->is_404 = false;

            // Tell WP to load the page template (which is landing.php)
            status_header(200);
            include(get_page_template_slug($dashboard_page_id) 
                ? locate_template(get_page_template_slug($dashboard_page_id)) 
                : get_page_template());
            exit;
        }
    }
}
add_action('template_redirect', 'finance_flow_redirect_react_routes_to_dashboard');

