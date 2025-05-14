<?php
/* Template Name: Finance Flow Dashboard */

// Redirect to login if not logged in
if ( ! is_user_logged_in() ) {
    wp_redirect( wp_login_url() );
    exit;
}

get_header();
?>

<div id="root" data-api="<?php echo esc_url(rest_url('finance-flow/v1')); ?>"></div>

<?php get_footer(); ?>
