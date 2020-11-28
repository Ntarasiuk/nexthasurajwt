import Link from "next/link";

const Form = ({ isLogin, errorMessage, onSubmit, googleAuth }) => (
  <form onSubmit={onSubmit} className="mt-6">
    <div className="grid min-h-screen place-items-center">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-xl font-semibold">
          <span className="font-normal text-2xl">Sign in to continue</span>
        </h1>
        {errorMessage && (
          <p className="text-red-600 text-xl text-center">{errorMessage}</p>
        )}

        <label
          htmlFor="email"
          className="block text-xs font-semibold text-gray-600 uppercase"
        >
          E-mail
          <input
            id="email"
            type="email"
            name="email"
            placeholder="jon.snow@company.com"
            autoComplete="email"
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          />
        </label>

        {!isLogin && (
          <>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-gray-600 uppercase"
            >
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Jon Snow"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              required
            />
          </>
        )}
        <label
          htmlFor="password"
          className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          autoComplete="current-password"
          className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
          required
        />
        {!isLogin && (
          <>
            <label
              htmlFor="rpassword"
              className="block mt-2 text-xs font-semibold text-gray-600 uppercase"
            >
              Repeat password
            </label>
            <input
              id="rpassword"
              type="password"
              name="rpassword"
              placeholder="********"
              autoComplete="current-password"
              className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="rounded-lg w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
        >
          Sign in
        </button>
        {googleAuth && (
          <button
            onClick={googleAuth}
            className="rounded-lg w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
          >
            Continue with Google
          </button>
        )}

        <div className="submit" className="py-3">
          {isLogin ? (
            <>
              <Link href="/signup">
                <a>I don't have an account</a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <a>I already have an account</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </form>
);

export default Form;
