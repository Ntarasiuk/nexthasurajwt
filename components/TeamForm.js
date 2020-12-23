import Link from "next/link";

const TeamForm = ({ errorMessage, onSubmit }) => (
  <form onSubmit={onSubmit} className="mt-6">
    <div className="grid place-items-center">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-xl font-semibold mb-4">
          <span className="font-normal text-2xl">Team Sign up</span>
        </h1>
        {errorMessage && (
          <p className="text-red-600 text-xl text-center">{errorMessage}</p>
        )}

        <label
          htmlFor="email"
          className="block text-xs font-semibold text-gray-600 uppercase"
        >
          Company Name
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Acme Company Ltd"
            autoComplete="company"
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
            required
          />
        </label>


        <button
          type="submit"
          className="rounded-lg w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none"
        >
          Create Team
        </button>
      </div>
    </div>
  </form>
);

export default TeamForm;
