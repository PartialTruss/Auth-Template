export const verifyEmail = async () => {
    if (!token) {
        if (isMounted) {
            setStatus("error");
        }
        return;
    }

    try {
        const res = await axios.get(
            `http://localhost:3000/auth/verify-email?token=${token}`
        );

        if (!isMounted) return;

        setStatus("success");
        setStatus(res.data.message);

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    } catch (err) {
        if (err instanceof AxiosError) {
            if (!isMounted) return;

            setStatus("error");
            setStatus(
                err.response?.data?.message || "Verification failed. Try again."
            );
        }
    }
};