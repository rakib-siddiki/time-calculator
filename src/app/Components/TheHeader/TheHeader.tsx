import Link from "next/link";

const TheHeader = () => {
  return (
    <header>
      <nav className="py-4">
        <ul className="flex gap-4 items-center justify-center">
          <li className="text-lg font-semibold hover:text-blue-600">
            <Link href="/">Home</Link>
          </li>
          <li className="text-lg font-semibold hover:text-blue-600">
            <Link href="/total-duration">Total Duration</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default TheHeader;
