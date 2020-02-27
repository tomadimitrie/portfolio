import { AppProps } from "next/app";
import Nav from "../components/nav";
import Head from "next/head";

const App = (props: AppProps) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Oxanium:400,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        />
      </Head>
      <Nav />
      <props.Component {...props.pageProps} />
      <style jsx global>{`
        html,
        body,
        #__next {
          background-color: #000000;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default App;
