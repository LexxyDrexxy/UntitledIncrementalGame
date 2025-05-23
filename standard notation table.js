let standardNotationTable = [ // antimatter dimensions numbers, basically up to 1e100, 10DTg or 1 googol
    {divider:"1e99",suffix:"DTg"},
    {divider:"1e96",suffix:"UTg"},
    {divider:"1e93",suffix:"Tg"},
    {divider:"1e90",suffix:"NVg"},
    {divider:"1e87",suffix:"OVg"},
    {divider:"1e84",suffix:"SpVg"},
    {divider:"1e81",suffix:"SxVg"},
    {divider:"1e78",suffix:"QtVg"},
    {divider:"1e75",suffix:"QaVg"},
    {divider:"1e72",suffix:"TVg"},
    {divider:"1e69",suffix:"DVg"}, // sigh
    {divider:"1e66",suffix:"UVg"},
    {divider:"1e63",suffix:"Vg"},
    {divider:"1e60",suffix:"NDc"},
    {divider:"1e57",suffix:"ODc"},
    {divider:"1e54",suffix:"SpDc"},
    {divider:"1e51",suffix:"SxDc"},
    {divider:"1e48",suffix:"QtDc"},
    {divider:"1e45",suffix:"QaDc"},
    {divider:"1e42",suffix:"TDc"},
    {divider:"1e39",suffix:"DDc"},
    {divider:"1e36",suffix:"UDc"},
    {divider:"1e33",suffix:"Dc"},
    {divider:"1e30",suffix:"No"},
    {divider:"1e27",suffix:"Oc"},
    {divider:"1e24",suffix:"Sp"},
    {divider:"1e21",suffix:"Sx"},
    {divider:"1e18",suffix:"Qt"},
    {divider:"1e15",suffix:"Qa"},
    {divider:"1e12",suffix:"T"},
    {divider:"1e9",suffix:"B"},
    {divider:"1e6",suffix:"M"},
    {divider:"1e3",suffix:"k"},
]

function convertToAbbreviation(number) {
    number = BigInt(number);
    for (let i of standardNotationTable.reverse()) {
        i.divider = BigInt(i.divider);
        if (number / i.divider < 1) continue;
        return (number / i.divider).toString() + i.suffix;
    }
    return Infinity;
}
/*
M	B	T	Qa	Qt	Sx	Sp	Oc	No	Dc
Dc  Vg	Tg  Qd  Qi  Se	St  Og	Nn	Ce
Ce  Dn  Tc  Qe  Qu  Sc  Si  Oe  Ne

1.79e308                        Biggest non-BigInt value
1e3,003                         1MI
1e3,000,003                     1MC
1e3,000,000,003                 1NA
1e3,000,000,000,003             1PC
1e3,000,000,000,000,003         1FM
1e3,000,000,000,000,000,003     1AT
1e3,000,000,000,000,000,000,003 1ZP
>1ZP                            undefined
*/