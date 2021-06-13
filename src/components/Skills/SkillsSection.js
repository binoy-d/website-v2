import React, { useState, useEffect } from "react";
import "./SkillsSection.css";
import Container from "react-bootstrap/Container";
import SectionHeader from "../SectionHeader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { skills } from "../data";
import Fade from "react-reveal";
import NavLink from "../Nav/NavLink";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import { IoArrowBackCircleOutline } from "react-icons/io5";
class SkillsIconBackground extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrollpos: 0 };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }

  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = 200 * (winScroll / height);

    document
      .getElementById("skills-wrapper")
      .style.setProperty("--x", -scrolled + "em");
  };

  render() {
    return (
      <div id="skills-wrapper">
        <div className="skills-content"> {this.props.children} </div>
      </div>
    );
  }
}

function SkillsList({ title, skillList, handleClick }) {
  return (
    <Col lg={3} xs={6} className="skill-list" onClick={handleClick}>
      <Row className="text-center">
        <Col>
          <div className="skill-count">
            <CountUp end={skillList.length} redraw={true}>
              {({ countUpRef, start }) => (
                <VisibilitySensor onChange={start} delayedCall>
                  <span ref={countUpRef} />
                </VisibilitySensor>
              )}
            </CountUp>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <h2 className="skill-header"> {title} </h2>
      </Row>
    </Col>
  );
}

function SkillsContent() {
  const [skillGroupSelected, setSkillGroupSelected] = useState(false);
  const [skillGroup, setSkillGroup] = useState("");
  const [skillList, setSkillList] = useState([]);

  //when skillgroup changed, update skillist
  useEffect(() => {
    console.log(skillGroup);
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].title === skillGroup) {
        setSkillList(skills[i].items);
        return;
      }
    }
    setSkillList([]);
  }, [skillGroup]);

  //when skilllist updated, setskillgroupselected to true
  useEffect(() => {
    console.log(skillList);
    setSkillGroupSelected(skillList.length > 0);
  }, [skillList]);

  return (
    <div className="fill-width skills-content-wrapper">
      <Container className="fill-width">
        <div className="skills-window">
          <Row className="text-center">
            <div className="skills-title">
              {skillGroupSelected ? (
                 <SectionHeader text={skillGroup} />
              ) : (
                <SectionHeader text="Skills" />
              )}
            </div>
          </Row>
          {skillGroupSelected ? (
            <Row>
              {skillList.map((skill) => (
                <Col xs={6} sm={4} md={3} className="text-center">
                  <div className="skill-item">{skill}</div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              {skills.map((value, index) => (
                <SkillsList
                  handleClick={() => setSkillGroup(value.title)}
                  key={"skill-list-" + index}
                  title={value.title}
                  skillList={value.items}
                />
              ))}
            </Row>
          )}

          <Row>
            {skillGroupSelected ? (
                
              <IoArrowBackCircleOutline
               className="skills-back-arrow"
               onClick={()=>setSkillGroupSelected(false)} />
            ) : (
              <Fade bottom>
                <div className="projects-btn">
                  <NavLink
                    className="btn btn-outline-light skills-btn"
                    destination="projects"
                    text="Projects"
                  ></NavLink>
                </div>
              </Fade>
            )}
          </Row>
        </div>
      </Container>
    </div>
  );
}

function SkillsSection() {
  return (
    <section id="skills">
      <SkillsIconBackground>
        <SkillsContent />
      </SkillsIconBackground>
    </section>
  );
}

export default SkillsSection;
