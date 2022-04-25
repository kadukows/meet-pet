import React from 'react';

type Props = {};

const SearchSvgDefinitions = (props: Props) => {
    return (
        <React.Fragment>
            <svg
                style={{ width: 0, height: 0, position: 'absolute' }}
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <linearGradient id="my-cool-gradient" x2="1" y2="1">
                        {/*
                        <stop
                            offset="0%"
                            style={{ stopColor: 'var(--first-color, yellow)' }}
                        />
                        */}
                        <stop
                            offset="0%"
                            stopColor="param(firstColor) yellow"
                        />
                        <stop offset="50%" style={{ stopColor: '#224488' }} />
                        <stop offset="100%" stopColor="#112266" />
                    </linearGradient>

                    <path
                        id="my-favorite-svg-icon"
                        d={FAVORITE_PATH_SVG_STRING}
                    />

                    <filter
                        id="my-shadow-filter"
                        x="0"
                        y="0"
                        width="200%"
                        height="200%"
                    >
                        <feOffset
                            result="offOut"
                            in="SourceGraphic"
                            dx="20"
                            dy="20"
                        />
                        <feBlend
                            in="SourceGraphic"
                            in2="offOut"
                            mode="normal"
                        />
                    </filter>

                    <filter
                        id="my-translate-filter"
                        x="0"
                        y="0"
                        width="48"
                        height="48"
                    >
                        <feOffset
                            result="SourceGraphic"
                            in="SourceGraphic"
                            dx="12"
                            dy="12"
                        />
                    </filter>

                    <filter
                        id="my-blur-filter"
                        x="0"
                        y="0"
                        width="200%"
                        height="200%"
                    >
                        <feOffset
                            result="offOut"
                            in="SourceGraphic"
                            dx="0"
                            dy="0"
                        />
                        <feGaussianBlur
                            result="blurOut"
                            in="offOut"
                            stdDeviation="3"
                        />
                        <feBlend
                            in="SourceGraphic"
                            in2="blurOut"
                            mode="normal"
                        />
                    </filter>

                    <linearGradient
                        id="leaf-gradient"
                        x1="100%"
                        y1="0%"
                        x2="0%"
                        y2="0%"
                    >
                        <stop offset="6.25%" style={{ stopColor: '#87FFFE' }} />
                        <stop
                            offset="18.75%"
                            style={{ stopColor: '#88FF89' }}
                        />
                        <stop
                            offset="31.25%"
                            style={{ stopColor: '#F8F58A' }}
                        />
                        <stop
                            offset="43.75%"
                            style={{ stopColor: '#EF696A' }}
                        />
                        <stop
                            offset="56.25%"
                            style={{ stopColor: '#F36ABA' }}
                        />
                        <stop
                            offset="68.75%"
                            style={{ stopColor: '#EF696A' }}
                        />
                        <stop
                            offset="81.25%"
                            style={{ stopColor: '#F8F58A' }}
                        />
                        <stop
                            offset="93.75%"
                            style={{ stopColor: '#88FF89' }}
                        />
                        <stop offset="100%" style={{ stopColor: '#87FFFE' }} />
                    </linearGradient>

                    <pattern
                        id="leaf-pattern"
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                    >
                        <rect
                            x="-150%"
                            y="0"
                            width="200%"
                            height="100%"
                            fill="url(#leaf-gradient)"
                            transform="rotate(-65)"
                        >
                            <animate
                                attributeType="XML"
                                attributeName="x"
                                from="-150%"
                                to="50%"
                                dur="6s"
                                repeatCount="indefinite"
                            />
                        </rect>
                        <rect
                            x="-350%"
                            y="0"
                            width="200%"
                            height="100%"
                            fill="url(#leaf-gradient)"
                            transform="rotate(-65)"
                        >
                            <animate
                                attributeType="XML"
                                attributeName="x"
                                from="-350%"
                                to="-150%"
                                dur="6s"
                                repeatCount="indefinite"
                            />
                        </rect>
                    </pattern>

                    <linearGradient id="skyGradient" x1="100%" y1="100%">
                        <stop
                            offset="0%"
                            stopColor="lightblue"
                            stopOpacity=".5"
                        >
                            <animate
                                attributeName="stop-color"
                                values="lightblue;blue;red;red;black;red;red;purple;lightblue"
                                dur="14s"
                                repeatCount="indefinite"
                            />
                        </stop>
                        <stop
                            offset="100%"
                            stopColor="lightblue"
                            stopOpacity=".5"
                        >
                            <animate
                                attributeName="stop-color"
                                values="lightblue;orange;purple;purple;black;purple;purple;blue;lightblue"
                                dur="14s"
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="offset"
                                values=".95;.80;.60;.40;.20;0;.20;.40;.60;.80;.95"
                                dur="14s"
                                repeatCount="indefinite"
                            />
                        </stop>
                    </linearGradient>
                </defs>
            </svg>
        </React.Fragment>
    );
};

export default SearchSvgDefinitions;

//////////

const FAVORITE_PATH_SVG_STRING =
    'm12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
