# Breakpoint Cleaner

This tool strips responsive styles out of raw CSS so that they can be moved to their own stylesheet.

Paste raw CSS into the input field and the tool will produce two outputs: one with the cleaned CSS and one with the responsive styles. To create responsive stylesheets, overwrite your original CSS with the cleaned CSS and create a new stylesheet with the responsive styles. Link to your new stylesheet and set the media attribute equal to your query, e.g.: `@media only screen and (min-width: 768px)` => `<link rel="stylesheet" type="text/css" media="screen and (min-width: 768px)"...`.
