import { apiFetch, getErrorMessage } from "@/lib/api-error";

async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setMsg("");
  setLoading(true);

  try {
    const data = await apiFetch<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setCookie("admin_token", data.access_token);
    setMsg("เข้าสู่ระบบสำเร็จ");
    router.push("/admin");
    router.refresh();
  } catch (err) {
    setMsg(getErrorMessage(err));
  } finally {
    setLoading(false);
  }
}