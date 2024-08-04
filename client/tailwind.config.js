import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        '120':"600px"
      },
      backgroundSize:{
        '300':'300%'
      },
      animation:{
        'bg-animation':'bg-animation 10s infinite'
      },
      keyframes:{
        "bg-animation":{
          '0%':{
            'background-position':'left'
          },
          '100%':{
            'background-position':'right'
          }
        }
      }
    },
  },
  plugins:[
    daisyui
  ],
  daisyui:{
    theme:['light']
  }
}

