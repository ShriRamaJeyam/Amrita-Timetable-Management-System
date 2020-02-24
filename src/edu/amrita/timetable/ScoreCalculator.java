package edu.amrita.timetable;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;
public class ScoreCalculator implements EasyScoreCalculator<Solver> 
{
	 @Override
	 public HardSoftScore calculateScore(Solver TimeTable) 
	 {
		 int hard=0,soft=0;
		 for(Lecture lecture1:TimeTable.leclst)
		 {
			 for(Lecture lecture2:TimeTable.leclst)
			 {
				 if(!(lecture1.equals(lecture2)))
				 {
					 
				 }
			 }
		 }
		 
		 
		 return HardSoftScore.of(hard, soft);
	 }
}
