export default function redirect(url: string) {
  return new Response(null, {
    status: 302,
    headers: {
      location: url,
    },
  });
}

export function redirectToLogin() {
  return redirect("/api/auth/signin");
}


