import { FormEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { DefaultColorPalette, NeutralColorPalette, OpacityColorPalette, PalettePreview, SimilarColorPalette, Form } from 'components';
import { convertToHex, OPACITY } from 'utils';

export default function Create() {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const [colors, setColors] = useState<string[]>([]);
    const [hexColors, setHexColors] = useState<string[]>([]);

    const [hue, setHue] = useState(258);
    const [saturation, setSaturation] = useState(80);
    const [lightness, setLightness] = useState(10);

    const [selected, setSelected] = useState('hsla(258deg, 80%, 10%, 1)');
    const [selectedHex, setSelectedHex] = useState('11052C');
    const [selectedInputValue, setSelectedInputValue] = useState({ color: '', index: 0 });

    const onClick = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>, color: string) => {
        const rgb = e.currentTarget.style.backgroundColor;
        const isRGBA = rgb.includes('rgb(') ? false : true;
        const rgbArray = rgb.includes('rgb(') ? rgb.replace('rgb(', '').replace(')', '').split(', ') : rgb.replace('rgba(', '').replace(')', '').split(', ');

        const hexCode = Array.from(Array(isRGBA ? 4 : 3)).reduce((prev, cur, index) => {
            let rgbToHex = '';
            if (index === 3) {
                rgbToHex = prev + OPACITY[Number(rgbArray[3].replace('0.', '')) - 1];
            } else {
                rgbToHex = `${prev}${convertToHex(rgbArray[index])}`;
            }
            return rgbToHex;
        }, '');

        setSelectedHex(`#${hexCode}`);

        const rgba = color.split('(')[1].split(')')[0].split(',');
        setSelected(color);
        setHue(Number(rgba[0].replace('deg', '')));
        setSaturation(Number(rgba[1].replace('%', '')));
        setLightness(Number(rgba[2].replace('%', '')));
    };

    const handleReset = () => setColors([]);

    const handleSelect = () => {
        setColors((prev) => [...prev, selected]);
        setHexColors((prev) => [...prev, selectedHex]);
        setSelected('hsla(258deg, 80%, 10%, 1)');
        setSelectedHex('11052C');
    };

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (hexColors.length) {
            const prev = JSON.parse(localStorage.getItem('colors') || '[]');
            const newColors = [...prev, { name: name || 'MY COLOR PALETTE', colors: hexColors }];
            localStorage.setItem('colors', JSON.stringify(newColors));
            navigate('/');
        } else {
            alert('????????? ?????? ?????? ????????? ?????????!');
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function handleClickOutsideSelect(event: any) {
            if (inputRef.current && !inputRef.current.contains(event.target as Node) && selectedInputValue.color) {
                const hex = selectedInputValue.color.replace('#', '');
                const rgb = `rgb(${parseInt(hex.slice(0, 2), 16)},${parseInt(hex.slice(2, 4), 16)},${parseInt(hex.slice(4), 16)})`;

                const changedColors = colors.slice(0);
                changedColors.splice(selectedInputValue.index, 1, rgb);
                setColors(changedColors);

                const changedHexColors = hexColors.slice(0);
                changedHexColors.splice(selectedInputValue.index, 1, `#${hex}`);
                setHexColors(changedHexColors);

                setSelectedInputValue({ color: '', index: 0 });
            }
        }

        window.addEventListener('click', handleClickOutsideSelect, true);
        return () => window.removeEventListener('click', handleClickOutsideSelect, true);
    }, [colors, hexColors, selectedInputValue]);

    const handleColorChange = (e: FormEvent<HTMLInputElement>, index: number) => setSelectedInputValue({ color: e.currentTarget.value, index });

    return (
        <main style={{ backgroundColor: selected }} className="w-full min-h-screen">
            <section className="h-screen">
                <div className="h-screen flex justify-between text-[#11052C]">
                    <div className="fixed overflow-y-auto bg-white h-full w-[500px] p-5">
                        <h2 className="sticky top-0 text-2xl w-full text-center font-mono uppercase mb-5 font-bold">Create Palette</h2>
                        <div>
                            <DefaultColorPalette onClick={onClick} />
                            <NeutralColorPalette onClick={onClick} />
                            <SimilarColorPalette hue={hue} saturation={saturation} onClick={onClick} />
                            <OpacityColorPalette hue={hue} saturation={saturation} lightness={lightness} onClick={onClick} />
                            <Form setName={setName} handleSave={handleSave} handleReset={handleReset} handleSelect={handleSelect} />
                        </div>
                    </div>
                    <div className="w-full ml-[500px] p-5 flex items-center justify-center flex-col">
                        <Link to="/">
                            <h1 className="w-full text-center text-5xl mb-10 font-bold underline text-[#FAF4FF]">My Color Palette</h1>
                        </Link>
                        <div className="flex flex-col w-full border border-[#11052C] rounded-md overflow-hidden">
                            <PalettePreview inputRef={inputRef} colors={colors} hexColors={hexColors} handleColorChange={handleColorChange} />
                            <h3 className="text-[24px] text-center font-mono border-t border-[#11052C] text-black font-bold p-5 bg-white rounded-md rounded-t-none">{name}</h3>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
