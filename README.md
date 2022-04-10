# SA2: Frontend Starterpack

[deployed url](https://sa2starterpack.onrender.com)

## What Worked Well
The instructions were very easy to follow and I feel like I have a good understanding now of how to set up a Node project from scratch, and it's nice that I will be able to reference this repo if I need to in the future.

## What Didn't
You may have seen my soliloquy in Slack about this but I was experiencing a strange issue where none of my images would show up correctly; it turned out that it was because file-loader was conflicting with babel-loader with the end result of corrupting my images :( Thankfully, Tim discovered that Webpack 5 now does image loading automatically, so I uninstalled file-loader, altered my webpack.config, and magically my logo file showed up!

## Extra Credit
I played around a little with styling and created a custom logo and favicon for this project, as well as importing a special font

## Screenshots
![screenshot](https://drive.google.com/uc?export=download&id=1t9fMCwJZ6TbZnDCGZbMQ_mHHmYHi9QHp)
see [/src/img/screenshot.png](https://github.com/dartmouth-cs52-22S/starterpack-isabellahoch/blob/main/src/img/screenshot.png)