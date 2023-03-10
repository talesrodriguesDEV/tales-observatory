import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import ObservatoryContext from '../context/ObservatoryContext';
import { AiFillHeart, AiOutlineHeart, AiOutlineDownload } from 'react-icons/ai';
import { PictureCardContainer } from '../styles';

export default function PictureCard({ picture, details, moreInfo }) {
	const { id, title, description, date, url } = picture;

	const { savedPictures, setSavedPictures, theme } = useContext(ObservatoryContext);

	const [isPicSaved, setIsPicSaved] = useState(false);

	useEffect(() => {
		const localPics = JSON.parse(localStorage.getItem('favPics'));
		const picSaved = localPics.some(pic => pic.id === id);

		setIsPicSaved(picSaved);
		setSavedPictures(localPics);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const editFavs = () => {
		let newFavPics;

		if (isPicSaved) newFavPics = savedPictures.filter(pic => pic.id !== id);
		else newFavPics = [...savedPictures, picture];

		localStorage.setItem('favPics', JSON.stringify(newFavPics));

		setSavedPictures(newFavPics);
		setIsPicSaved(prev => !prev);
	};

	const sameProperties = { maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' };
	const heartStyle = { color: '#fb7185', margin: '10px', cursor: 'pointer' };

	return (
		<PictureCardContainer appTheme={theme}>
			{details && (
				<div style={{ padding: '20px' }}>
					<h2 style={{ ...sameProperties }}>{title}</h2>
					<p style={{ ...sameProperties, margin: '10px 0px' }}>{description}</p>
					<p style={{ textAlign: 'center' }}>{new Date(date).toLocaleDateString('pt-BR')}</p>
				</div>
			)}
			<section>
				<Image fill sizes='(max-width: 600px) 20vw' src={url} alt={title} priority />
			</section>
			<div style={{ fontSize: '3em', display: 'flex', alignItems: 'center' }}>
				{isPicSaved ? <AiFillHeart style={heartStyle} onClick={editFavs} /> : (
					<AiOutlineHeart style={heartStyle} onClick={editFavs} />
				)}
				<a href={`https://images-api.nasa.gov/search?nasa_id=${id}`} download target='_blank' rel="noreferrer">
					<AiOutlineDownload style={{ margin: '10px' }} />
				</a>
			</div>
			{moreInfo && <Link href={`/picture/${id}`} style={{ marginBottom: '15px' }}>More info</Link>}
		</PictureCardContainer>
	);
}
