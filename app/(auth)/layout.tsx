export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {/* <Head>
                <title>Auth</title>
            </Head> */}
            {children}
        </div>
    )
}

