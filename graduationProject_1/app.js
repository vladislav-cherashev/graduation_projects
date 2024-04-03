const selectors = {
    form   : '#form-data',
    btnForm: '#btn-form',
    k      : '#k',
    lambda : '#lambda',
    Ho     : '#Ho',
    H      : '#H',
    Hpodn  : '#Hpodn',
    delta  : '#delta',
    or     : '#or',
    nAVT   : '#nAVT',
    RoPM   : '#RoPM',
    Wcvi   : '#Wcvi',
    xui    : '#xui',
    ha     : '#ha',
    Wpi    : '#Wpi',
    WmedI  : '#WmedI',
};

let controls = {};

let cash = {};

function init() {
    controls = querySelectorToHash( document, selectors );
    addEventListeners();
}

function querySelectorToHash( context, selectors ) {
    const hash = {};
    _.forEach( _.keys( selectors ), key => {
        return hash[ key ] = context.querySelector( selectors[ key ] ) || null;
    } );
    return hash;
}

function addEventListeners() {
    const { btnForm } = controls;
    btnForm.addEventListener( 'click', getInputValue );
}

// функция получения данных из формы
function getInputValue( event ) {
    event.preventDefault();
    const { form } = controls;
    const data = new FormData( form );
    cash = {
        Nlev  : Number( data.get( 'Nlev' ) ),
        Nprav : Number( data.get( 'Nprav' ) ),
        R1    : Number( data.get( 'R1' ) ),
        R0    : Number( data.get( 'R0' ) ),
        c     : Number( data.get( 'c' ) ),
        fmal  : Number( data.get( 'fmal' ) ),
        Fotr  : Number( data.get( 'Fotr' ) ),
        Fbig  : Number( data.get( 'Fbig' ) ),
        nAVT  : Number( data.get( 'nAVT' ) ),
        nAVTud: Number( data.get( 'nAVTud' ) ),
        Rpd   : Number( data.get( 'Rpd' ) ),
        Gpd   : Number( data.get( 'Gpd' ) ),
        Gpm   : Number( data.get( 'Gpm' ) ),
        Rpr   : Number( data.get( 'Rpr' ) ),
        Wo    : Number( data.get( 'Wo' ) ),
        Nprep : Number( data.get( 'Nprep' ) ),
        Func  : Number( data.get( 'Func' ) ),
    };
    onCalculateButtonClick();
}

// Функция рассчета
function onCalculateButtonClick() {
    // Для первого расчета
    const k = cash.R1 / cash.R0;
    const lambda = cash.c / cash.fmal;
    const x = ( cash.R0 * lambda * k * ( 1 - k ) ) / 3;
    const H0 = Math.sqrt( x );
    const H = ( cash.Nlev + cash.Nprav ) / 2;

    // Для второго расчета
    const Hpodn = cash.Nprep + H0;
    if( H > H0 ) {
        const deltaR = ( Math.pow( H, 2 ) ) / 2 * cash.R0 * k * ( 1 - k );
        // Для 3го расчета
        const V = 1 + Math.pow( cash.Fotr, 2 ) + 2 * cash.Fbig * ( ( 2 * 3.14 ) / lambda * deltaR + cash.Func )
        const nAVT = cash.nAVT + cash.nAVTud;
        const Rpd = cash.Rpd;
        const Gpd = cash.Gpd;
        const Gpm = cash.Gpm;
        const R0 = cash.R0;
        const y = (
            Rpd * Gpd * Gpm * ( Math.pow( lambda, 2 ) ) ) / ( ( 16 * Math.pow( 3.14, 2 ) ) * ( Math.pow(
            R0, 2 ) * nAVT ) );
        const Ropm = 10 * ( Math.log( y ) / Math.log( 10 ) );
        const log = ( R0 / lambda );
        const Wsvi = 122 + 20 * ( Math.log( log ) / Math.log( 10 ) );
        const x = Math.pow( R0, 2 ) * Math.pow( k, 2 ) * Math.pow( ( 1 - k ), 2 ) / cash.Rpr * H0;
        const µ = Math.pow( Math.sqrt( x ), 3 );
        const h = H / H0;
        const Wpi = cash.Wo * µ * ( 1 - h );
        const Wmedi = Wsvi + Wpi;

        // Вывод данных
        // 2я секция
        controls.k.value = k;
        controls.lambda.value = lambda;
        controls.Ho.value = H0;
        controls.H.value = H;
        controls.Hpodn.value = Hpodn;

        // 3я секция
        controls.delta.value = deltaR;
        controls.or.value = V;
        controls.nAVT.value = nAVT;
        controls.RoPM.value = Ropm;
        controls.Wcvi.value = Wsvi;
        controls.xui.value = µ;
        controls.ha.value = h;
        controls.Wpi.value = Wpi;
        controls.WmedI.value = Wmedi;
    }
}

( () => {
    init();
} )();