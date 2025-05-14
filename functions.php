<?php
// Enqueue Vite-built React app
function finance_flow_enqueue_assets() {
    // Get theme directory
    $theme_dir = get_template_directory_uri();

    // Enqueue the built main.js file
    wp_enqueue_script(
        'finance-flow-react',
        $theme_dir . '/dist/assets/index.js',
        array(), // No dependencies
        null,    // No version (or could use filemtime)
        true     // Load in footer
    );

    // Optionally, enqueue built CSS (if Vite generated CSS file)
    wp_enqueue_style(
        'finance-flow-style',
        $theme_dir . '/dist/assets/index.css',
        array(),
        null
    );
}
add_action('wp_enqueue_scripts', 'finance_flow_enqueue_assets');
