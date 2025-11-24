# Frameowrk

A browser game (PWA) where you control a cat with a mouse to draw frames for pictures.

You can install it to work offline!

# Gameplay

There are a few levels built-in. Each level has an image (PNG) and a frame (SVG).

The goal is to replicate the frame on the canvas.
The mouse (cursor) controls a cat which will leave paint behind if the left mouse button is held.

Upon the cat reaching the mouse, it will circle around it as long as the mouse is stationary.

~~Wiggle the mouse for the cat to pounce and draw a curve.~~ not yet implemented

The cat will move faster if it's farther from the mouse, and slower if it's closer.

> [!IMPORTANT]
> Resolution changes are not yet handled properly, and might also cause issues
> if loading a level made for an aspect ratio different from the current one.

Images were sourced from Pixabay (via pexels.com)

# Editor

The editor can be used to create new levels, which can be exported and/or saved to the cache.

> [!NOTE]
> For cached levels to show up in the levels list, reload the page.

SVG tools are the following:

- Move (translate object)
- Line
- Rectangle
- Circle
- Circumference (turn circle into arc)
- Rotate
- Undo
- Delete

You can also edit the contents of the SVG frame by clicking "Edit SVG"

> [!NOTE]
> Moving a rotated object moves the object the way it's oriented instead of relative to the canvas.
> This is because I couldn't figure out the math.

# Frameworks & Libraries

- Vue
- Vite
- Vite PWA
- JSZip
- FileSaver.js