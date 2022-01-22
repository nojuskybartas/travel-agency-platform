import { ChevronDownIcon } from "@heroicons/react/outline"
import { useEffect, useState } from "react"

function FooterElement({title, collapsable, ...props}) {

    const [visible, setVisible] = useState(collapsable ? false : true)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    const handleElementVisible = () => {
        collapsable && setVisible(!visible)
    }
    
    useEffect(() => {

        const changeWidth = () => {
          setScreenWidth(window.innerWidth);
        }
    
        window.addEventListener('resize', changeWidth)

        return () => {
            window.removeEventListener('resize', changeWidth)
        }

    }, [])


    return (
        <div className="p-2 w-full h-auto">
            <div className={`flex justify-between ${collapsable && 'cursor-pointer'} md:cursor-default w-full h-fit`} onClick={handleElementVisible}>
                <h1 className="font-bold text-lg">{title}</h1>
                {collapsable && <ChevronDownIcon className="w-6 h-6 sb-color md:hidden"/>}
            </div>
            <div className="space-y-1">
                {(visible || screenWidth>=768) && props.labels.map(label => {
                    return <p className="sb-underline cursor-pointer w-fit h-full">{label}</p>
                })}
            </div>
            <div className="text-sm text-gray-600">
                {(visible || screenWidth>=768) && props.labels_small?.map(label => {
                    return <p>{label}</p>
                })}
            </div>
        </div>
    )
}

function Footer() {
    return (
        <div className="flex justify-center bg-[#be948048] w-full h-fit">
            <div className=" mb-10 w-full max-w-[1080px] flex flex-col justify-between md:flex-row space-y-2 p-4">
                <FooterElement title="Contacts" labels={['Frequently asked questions', 'Contacts, branches, ATMs','Book a consultation','About Swedbank']} labels_small={['Some company', 'Address', 'Bank account info', 'Legal stuff']} collapsable={false}/>
                <FooterElement title="Useful links" labels={['Frequently asked questions', 'Contacts, branches, ATMs','Book a consultation','About Swedbank']} collapsable={true}/>
                <FooterElement title="Legal Information" labels={['Frequently asked questions', 'Contacts, branches, ATMs','Book a consultation','About Swedbank']} collapsable={true}/>
                <FooterElement title="Customer programmes" labels={['Frequently asked questions', 'Contacts, branches, ATMs','Book a consultation','About Swedbank']} collapsable={true}/>
            </div>
        </div>
    )
}

export default Footer
