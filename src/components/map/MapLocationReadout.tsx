import React from 'react';

type Props = {
  fromLabel: string;
  coordsPrefixGps: string;
  mapLocationGpsLive: string;
  mapInternalRouteFrom: string;
  mapLocationNoGpsHint: string;
  userGeoPosition: { lat: number; lng: number } | null;
  fromNodeLabel: string;
};

export default function MapLocationReadout({
  fromLabel,
  coordsPrefixGps,
  mapLocationGpsLive,
  mapInternalRouteFrom,
  mapLocationNoGpsHint,
  userGeoPosition,
  fromNodeLabel
}: Props) {
  return (
    <div className="mapLocationReadout">
      <div className="mapLocationLabel">{fromLabel}</div>
      {userGeoPosition ? (
        <>
          <p className="mapLocationPrimary">
            {coordsPrefixGps}: {userGeoPosition.lat.toFixed(6)}, {userGeoPosition.lng.toFixed(6)}
          </p>
          <p className="mapLocationMeta">{mapLocationGpsLive}</p>
          <p className="mapLocationMeta">
            {mapInternalRouteFrom} <strong>{fromNodeLabel || '—'}</strong>
          </p>
        </>
      ) : (
        <>
          <p className="mapLocationPrimary">{fromNodeLabel || '—'}</p>
          <p className="mapLocationMeta">{mapLocationNoGpsHint}</p>
        </>
      )}
    </div>
  );
}
