import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';

import { ApplicationState } from '../../utils/reduxStore';
import { DestinyManifestJsonContent } from '../../utils/reducers/manifest';
import '../../utils/destinyEnums';

import './styles.css';
import fallback from './fallback';
import weapon from './weapon';
import armour from './armour';
import emblem from './emblem';
import bounty from './bounty';
import mod from './mod';
import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2/interfaces';

interface TooltipProps {
  manifest?: DestinyManifestJsonContent
}

interface TooltipState {
  hash?: number
}

class Tooltip extends React.Component<TooltipProps, TooltipState> {

  private tooltipElement: HTMLDivElement | null = null
  private touchMovement: boolean

  constructor(props: TooltipProps) {
    super(props);

    this.bindings = this.bindings.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.touchMovement = false;
  }

  mouseMove = (e: MouseEvent) => {

    if (!this.tooltipElement) return

    let x = 0;
    let y = 0;
    let offset = 0;
    let tooltipWidth = 384;
    let tooltipHeight = this.state.hash ? this.tooltipElement.clientHeight : 0;
    let scrollbarAllowance = 24;

    x = e.clientX;
    y = e.clientY + offset;

    if (x + tooltipWidth + scrollbarAllowance > window.innerWidth) {
      x = x - tooltipWidth - offset;
    } else {
      x = x + offset;
    }

    if (y + tooltipHeight > window.innerHeight) {
      y = y - tooltipHeight - offset;
    }
    y = y < 0 ? 0 : y;

    if (this.state.hash) {
      this.tooltipElement.style.cssText = `top: ${y}px; left: ${x}px`;
    }
  };

  bindings = () => {
    let toolTipples: NodeListOf<HTMLElement> = document.querySelectorAll('.tooltip');
    toolTipples.forEach((item) => {

      item.addEventListener('mouseenter', (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        if (target.dataset.itemhash) {
          this.setState({
            hash: parseInt(target.dataset.itemhash, 10)
          });
        }
      });

      item.addEventListener('mouseleave', e => {
        this.setState({
          hash: undefined
        });
      });

      item.addEventListener('touchstart', e => {
        this.touchMovement = false;
      });

      item.addEventListener('touchmove', e => {
        this.touchMovement = true;
      });

      item.addEventListener('touchend', (e: TouchEvent) => {
        const target = e.currentTarget as HTMLElement
        if (!this.touchMovement) {
          if (target.dataset.itemhash) {
            this.setState({
              hash: parseInt(target.dataset.itemhash, 10)
            });
          }
        }
      });

    });
  };

  componentDidUpdate(prevProps: TooltipProps) {
    if (prevProps !== this.props) {
      this.setState({
        hash: undefined
      });
      this.bindings();
    }

    if (this.state.hash && this.tooltipElement) {
      this.tooltipElement.addEventListener('touchstart', e => {
        this.touchMovement = false;
      });
      this.tooltipElement.addEventListener('touchmove', e => {
        this.touchMovement = true;
      });
      this.tooltipElement.addEventListener('touchend', e => {
        e.preventDefault();
        if (!this.touchMovement) {
          this.setState({
            hash: undefined
          });
        }
      });
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.mouseMove);

    this.bindings();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseMove);
  }

  render() {
    let manifest = this.props.manifest;

    if (!manifest) return

    if (!this.state.hash) {
      return
    }

    let item;
    if (this.state.hash === 343) {
      item = {
        redacted: true
      };
    } else {
      item = manifest.DestinyInventoryItemDefinition[this.state.hash];
    }

    if (item.redacted) {
      return (
        <div id='tooltip' ref={(e) => this.tooltipElement = e}>
          <div className='acrylic' />
          <div className='frame common'>
            <div className='header'>
              <div className='name'>Classified</div>
              <div>
                <div className='kind'>Insufficient clearance</div>
              </div>
            </div>
            <div className='black'>
              <div className='description'>
                <pre>Keep it clean.</pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    let kind;
    let tier;
    let render;

    const itemIsNotRedacted = (item: { redacted: boolean } | DestinyInventoryItemDefinition): item is DestinyInventoryItemDefinition => {
      return !item.redacted
    }

    if (itemIsNotRedacted(item)) {

      switch (item.itemType) {
        case 3:
          kind = 'weapon';
          render = weapon(manifest, item);
          break;
        case 2:
          kind = 'armour';
          render = armour(manifest, item);
          break;
        case 14:
          kind = 'emblem';
          render = emblem(manifest, item);
          break;
        case 26:
          kind = 'bounty';
          render = bounty(manifest, item);
          break;
        case 19:
          kind = 'mod';
          render = mod(manifest, item);
          break;
        default:
          kind = '';
          render = fallback(manifest, item);
      }

      switch (item.inventory.tierType) {
        case 6:
          tier = 'exotic';
          break;
        case 5:
          tier = 'legendary';
          break;
        case 4:
          tier = 'rare';
          break;
        case 3:
          tier = 'uncommon';
          break;
        case 2:
          tier = 'basic';
          break;
        default:
          tier = 'basic';
      }

      return (
        <div id='tooltip' ref={e => this.tooltipElement = e}>
          <div className='acrylic' />
          <div className={cx('frame', tier, kind)}>
            <div className='header'>
              <div className='name'>{item.displayProperties.name}</div>
              <div>
                <div className='kind'>{item.itemTypeDisplayName}</div>
                <div className='rarity'>{item.inventory.tierTypeName}</div>
              </div>
            </div>
            <div className='black'>{render}</div>
          </div>
        </div>
      );

    }
  }
}

const mapStateToProps = (state: ApplicationState) => ({
  manifest: state.manifest.manifestContent
})

export default connect(
  mapStateToProps
)(Tooltip);
