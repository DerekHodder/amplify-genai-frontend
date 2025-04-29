export default function Header(){
    return (
        <header className="bg-red sticky top-0 z-50">
            <div className="flex justify-between items-center px-6">
                <div className="headerText">
                    <h1>Amplify</h1> 
                </div> 
                <div className="logo">
                    <img className="DClogo" src="davidsonwordmark-lockup-on red.png"></img>
                </div>
            </div>
        </header>
    );
}