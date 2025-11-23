# Frameowrk

A browser game (PWA) where you control a cat with a mouse to draw frames for pictures.

You can install it to work offline!

# Gameplay

There are a few levels built-in. Each level has an image (PNG) and a frame (SVG).

The goal is to replicate the frame on the canvas.
The mouse (cursor) controls a cat which will leave paint behind if the left mouse button is held.

Upon the cat reaching the mouse, it will circle around it as long as the mouse is stationary.

Wiggle the mouse for the cat to pounce and draw a curve.

# Editor

The editor can be used to create new levels, which can be exported and/or saved to the cache.

SVG tools are the following:

- Move object (translate)
- Line
- Rectangle
- Circle
- Delete

You can also write the contents of the SVG frame.

# Frameworks & Libraries

- Vue
- Vite
- Vite PWA
- JSZip
- FileSaver.js