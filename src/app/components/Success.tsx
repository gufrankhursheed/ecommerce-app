import Link from "next/link";

export default function Success() {
    return <>
        <div className="flex items-center justify-center h-screen">
            <div className="h-80">
                <div >
                    <div className="flex justify-center">
                        <button className="rounded-lg border border-primary-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">Toggle Modal</button>
                    </div>
                    <div className="fixed inset-0 z-10 bg-secondary-700/50"></div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                        <div className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm">
                            <div className="relative p-5">
                                <div className="text-center">
                                    <div className="mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-secondary-900">Order was placed</h3>
                                        <div className="mt-2 text-sm text-secondary-500">Your order was placed, we will notify you about the delivery information</div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-3">
                                    <Link href={"/products"} className="rounded-lg border w-full px-5 py-2.5 text-center text-white border-orange-500 bg-orange-500 hover:bg-orange-400 text-md font-medium shadow-sm transition-all disabled:cursor-not-allowed">Confirm</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}