import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <div id='portal'/>
        <div id='spinner-portal'/>
        <div id='modal-portal'/>
        <div id='info-portal'/>
        <NextScript />
      </body>
    </Html>
  )
}
