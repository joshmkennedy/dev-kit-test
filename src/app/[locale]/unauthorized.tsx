import Link from "next/link";

export default function Unauthorized() {
  return (
    <div>
      <h2>Unauthorized</h2>
      <p>You do not have permission to access this resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
