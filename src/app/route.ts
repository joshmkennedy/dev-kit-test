import redirect, { redirectToLogin } from "@/lib/protect/redirect";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return redirectToLogin();
  }
  const email = session.user?.email;
  if (!email) {
    return redirectToLogin();
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return redirectToLogin();
  }

  switch (true) {
    case user.roles.includes("admin"):
      return redirect("/admin");
    case user.roles.includes("manager"):
      return redirect("/manager");
    case user.roles.includes("user"):
      return redirect("/user");
    default:
      return redirectToLogin();
  }
}
