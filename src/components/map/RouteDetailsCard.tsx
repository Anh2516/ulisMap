import React from 'react';

type Props = {
  routeDetail: string;
  mapDestinationId: string;
  chooseDestination: string;
  mapSameStartEnd: string;
  isSameStartEnd: boolean;
  toPrefix: string;
  destinationLabel: string;
  routeDistance: number | null;
  routePathLabels: string[];
  routeSegments: string[];
  routeBoundsKey: string;
  mapStreetRouteBtn: string;
  mapStreetRouteClear: string;
  mapStreetRouteLoading: string;
  mapStreetRouteError: string;
  mapStreetStepsTitle: string;
  mapStreetStepsEmpty: string;
  streetRouteStatus: 'idle' | 'loading' | 'ok' | 'error';
  streetRouteLatLngCount: number;
  streetRouteSteps: string[];
  onFetchStreetWalkingRoute: () => void;
  onClearStreetWalkingRoute: () => void;
};

export default function RouteDetailsCard({
  routeDetail,
  mapDestinationId,
  chooseDestination,
  mapSameStartEnd,
  isSameStartEnd,
  toPrefix,
  destinationLabel,
  routeDistance,
  routePathLabels,
  routeSegments,
  routeBoundsKey,
  mapStreetRouteBtn,
  mapStreetRouteClear,
  mapStreetRouteLoading,
  mapStreetRouteError,
  mapStreetStepsTitle,
  mapStreetStepsEmpty,
  streetRouteStatus,
  streetRouteLatLngCount,
  streetRouteSteps,
  onFetchStreetWalkingRoute,
  onClearStreetWalkingRoute
}: Props) {
  return (
    <section className="routeBox card">
      <h2>{routeDetail}</h2>
      {!mapDestinationId ? (
        <p>{chooseDestination}</p>
      ) : isSameStartEnd ? (
        <p>{mapSameStartEnd}</p>
      ) : routeDistance != null ? (
        <>
          <p>
            {toPrefix} <strong>{destinationLabel}</strong>: ~{routeDistance} m
          </p>
          <ol>{routePathLabels.map((label, idx) => <li key={`route-node-${idx}`}>{label}</li>)}</ol>
          <div className="steps">
            {routeSegments.map((segment, segmentIndex) => (
              <span key={`${routeBoundsKey}-seg-${segmentIndex}`}>{segment}</span>
            ))}
          </div>
        </>
      ) : null}

      {mapDestinationId && (
        <div className="mapStreetRouteRow">
          <div className="mapStreetRouteBtns">
            <button
              type="button"
              className="ghostBtn smallGhost"
              onClick={onFetchStreetWalkingRoute}
              disabled={streetRouteStatus === 'loading'}
            >
              {mapStreetRouteBtn}
            </button>
            {streetRouteLatLngCount >= 2 && (
              <button type="button" className="ghostBtn smallGhost" onClick={onClearStreetWalkingRoute}>
                {mapStreetRouteClear}
              </button>
            )}
          </div>
          {streetRouteStatus === 'loading' && <p className="mapGeoMsg mapGeoNeutral">{mapStreetRouteLoading}</p>}
          {streetRouteStatus === 'error' && <p className="mapGeoMsg mapGeoErr">{mapStreetRouteError}</p>}
          {streetRouteStatus === 'ok' && (
            <>
              <p className="mapStreetStepsTitle">{mapStreetStepsTitle}</p>
              {streetRouteSteps.length > 0 ? (
                <ol className="mapStreetStepsList">
                  {streetRouteSteps.map((step, idx) => (
                    <li key={`street-step-${idx}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="mapGeoMsg mapGeoNeutral">{mapStreetStepsEmpty}</p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
