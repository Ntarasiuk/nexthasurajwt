import Head from "next/head";
import Footer from "./Footer";
import Header from "./header";

const Layout = ({children, title = 'Next.js Template'}) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <div className="flex flex-col min-h-screen min-w-screen">
      <Header />

      <main className="flex-grow w-full pt-20">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  </>
);

export default Layout;
