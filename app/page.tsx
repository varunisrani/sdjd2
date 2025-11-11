import Image from "next/image";

export default function Home() {
  return (
    <div className="center-flex min-h-screen bg-gray-50 font-sans">
      <main className="center-flex-col min-h-screen w-full max-w-3xl section-spacing bg-white center-col-responsive">
        <div className="mb-lg">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
        </div>
        <div className="center-flex-col gap-lg center-col-responsive vspace-lg">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-gray-900">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-gray-600">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-gray-900"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-gray-900"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="center-flex gap-md flex-col text-base font-medium sm:flex-row mt-lg">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-gray-300 px-5 transition-colors hover:border-transparent hover:bg-gray-50 md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
