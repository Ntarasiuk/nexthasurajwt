import Head from "next/head";
import Footer from "./Footer";
import Header from "./header";

const Layout = (props) => (
  <>
    <Head>
      <title>With Cookies</title>
    </Head>
    <div className="flex flex-col min-h-screen min-w-screen">
      <Header />

      <main className="flex-grow w-full pt-20">
        <div className="">{props.children}</div>
      </main>
      <Footer />
    </div>
  </>
);

export default Layout;
