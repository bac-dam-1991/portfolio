import { useEffect, useState } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const breakpointsMap: ReadonlyMap<Breakpoint, number> = new Map([
	['xs', 480],
	['sm', 768],
	['md', 1224],
	['lg', 1824],
	['xl', 1920],
]);

export type MediaQueryDirection = 'up' | 'down';

export type MediaQueryAttribute = 'max-width' | 'min-width';

export const MediaQueryMap: ReadonlyMap<
	MediaQueryDirection,
	MediaQueryAttribute
> = new Map([
	['up', 'min-width'],
	['down', 'max-width'],
]);

export const useMediaQuery = ({
	direction,
	breakpoint,
}: {
	direction: MediaQueryDirection;
	breakpoint: Breakpoint;
}) => {
	const [match, setMatch] = useState(false);

	useEffect(() => {
		const mediaAttribute = MediaQueryMap.get(direction);
		const _breakpoint = breakpointsMap.get(breakpoint);

		const queryList = window.matchMedia(
			`(${mediaAttribute}: ${_breakpoint}px)`
		);

		const updateMatch = () => {
			setMatch(queryList.matches);
		};

		updateMatch();

		queryList.addEventListener('change', updateMatch);

		return () => {
			queryList.removeEventListener('change', updateMatch);
		};
	}, [breakpoint, direction]);

	return match;
};
