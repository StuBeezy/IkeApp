import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';
import Flickr from '../ds/launch';

const buttons = [
    {
        text: 'Square 75/75', type: 's'
    },
    {
        text: 'Large Square', type: 'q'
    },
    {
        text: 'Thumbnail', type: 't'
    },
    {
        text: 'small', type: 'm'
    },
    {
        text: 'medium', type: 'c'
    },
    {
        text: 'original', type: 'o'
    }
];


class Photos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            size: null,
        };

        this.grabPhotos = this.grabPhotos.bind(this);
        this.renderPhotos = this.renderPhotos.bind(this);
        this.resetPhotos = this.resetPhotos.bind(this);
        this.onSizeButtonClick = this.onSizeButtonClick.bind(this);
    }

    createPhotoUrl(photo) {
        const { size } = this.state;
        if (size === 'o') {
            if (_.isUndefined(photo.originalsecret)) {
                return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
            } else {
                let { originalformat } = photo;
                return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.originalsecret}_${size}.${originalformat}`;
            }
        } else {
            return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
        }
    }

    createUserPhotoUrl = (photo) => {
        const { size } = this.state;
        return `https://www.flickr.com/photos/${photo.owner}/${photo.id}/sizes/${size}`;
    };

    grabPhotos = () => {
        const { size } = this.state;
        const flickr = new Flickr();
        let r = Math.random().toString(36).substring(0, 2);
        flickr.getPhotos(r, size)
            .then((response) => {
                this.setState({
                    photos: response.data.photos.photo
                })
            });
    };

    onSizeButtonClick = (e) => {
        const { target } = e;
        this.setState({
            size: target.getAttribute('photoSize')
        })
    };

    resetPhotos = () => {
        this.setState({
            photos: [],
            size: null
        });
    };

    renderPhotos = () => {
        const { photos } = this.state;

        console.log(photos);
        let photosLi = photos.map((photo) => {
            let photoUrl = this.createPhotoUrl(photo);
            let userUrl = this.createUserPhotoUrl(photo);
            return (
                <li className="photo-li">
                    <a href={userUrl} target="_blank">
                        <img src={photoUrl} alt={photo.title}
                        />
                    </a>
                </li>
            );
        });

        return (
            <ul>
                {photosLi}
            </ul>
        );
    };

    renderButtons = () => {
        const { size } = this.state;
        return buttons.map((button) => {
            return (
                <Col>
                    <Button photoSize={button.type} disabled={!_.isNull(size)} onClick={this.onSizeButtonClick}>
                        {button.text}
                    </Button>
                </Col>
            );
        });
    };

    render() {
        const { size } = this.state;
        return (
            <div>
                <h1>Select size of photos you want to see</h1>
                <Row>
                    {this.renderButtons()}
                </Row>
                <h1>Hit button below to render photos</h1>
                <p>Upto ten photos will be displayed.
                    Clicking on a photo will take
                    you to the Flickr page containing the photo.
                </p>
                <Row>
                    <Col sm={8}>
                        <Button style={{ marginRight: '10px'}} variant="success" disabled={_.isNull(size)} onClick={this.grabPhotos}>
                            Fetch Recent Photos
                        </Button>
                        <Button variant="light" onClick={this.resetPhotos}>
                            Reset
                        </Button>
                    </Col>
                </Row>
                <Row style={{marginTop: '45px'}}>
                    {this.renderPhotos()}
                </Row>
            </div>
        );
    }
}

export default Photos;
